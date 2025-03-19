"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/constants";
import { ActiveElement, Attributes } from "@/types/type";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const toggleAuthMode = () => setIsSignUpMode(!isSignUpMode);

  const undo = useUndo();
  const redo = useRedo();

  const canvasObjects = useStorage((root) => root.canvasObjects);
  const fabricRef = useRef<fabric.Canvas | null>(null); // Allowing null initially
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for canvas element
  const activeObjectRef = useRef<fabric.Object | null>(null);

 
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);

  const isEditingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const [elementAttributes, setElementAttributes] = useState({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;

    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    return canvasObjects.size === 0;
  }, []);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);
  }, []);
/**
   * Set the active element in the navbar and perform the action based
   * on the selected element.
   *
   * @param elem
   */
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      // delete all the shapes from the canvas
      case "reset":
        // clear the storage
        deleteAllShapes();
        // clear the canvas
        fabricRef.current?.clear();
        // set "select" as the active element
        setActiveElement(defaultNavElement);
        break;

      // delete the selected shape from the canvas
      case "delete":
        // delete it from the canvas
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        // set "select" as the active element
        setActiveElement(defaultNavElement);
        break;

      // upload an image to the canvas
      case "image":
        // trigger the click event on the input element which opens the file dialog
        imageInputRef.current?.click();
        /**
         * set drawing mode to false
         * If the user is drawing on the canvas, we want to stop the
         * drawing mode when clicked on the image item from the dropdown.
         */
        isDrawing.current = false;

        if (fabricRef.current) {
          // disable the drawing mode of canvas
          fabricRef.current.isDrawingMode = false;
        }
        break;

      // for comments, do nothing
      case "comments":
        break;

      default:
        // set the selected shape to the selected element
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };
  // Initialize Fabric.js canvas and handle event listeners when the user is logged in
  useEffect(() => {
    if (!isLoggedIn || !canvasRef.current) return;

    console.log("User logged in. Initializing Fabric.js...");
    
    fabricRef.current = new fabric.Canvas(canvasRef.current); // Initialize the canvas

    if (!fabricRef.current) {
      console.error("Fabric.js canvas not initialized!");
      return;
    }

    // Fabric.js Event Handlers
    fabricRef.current.on("object:added", (e) => {
      console.log("Object added:", e.target);
    });

    fabricRef.current.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas: fabricRef.current,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    fabricRef.current.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas: fabricRef.current,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    fabricRef.current.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas: fabricRef.current,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    fabricRef.current.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    fabricRef.current.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    fabricRef.current.on("object:moving", (options) => {
      handleCanvasObjectMoving({ options });
    });

    fabricRef.current.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    fabricRef.current.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    fabricRef.current.on("mouse:wheel", (options) => {
      handleCanvasZoom({ options, canvas: fabricRef.current });
    });

    // Event listeners for window resize and keyboard actions
    const handleResizeEvent = () => handleResize({ canvas: fabricRef.current });
    const handleKeyDownEvent = (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });

    window.addEventListener("resize", handleResizeEvent);
    window.addEventListener("keydown", handleKeyDownEvent);

    // Cleanup function to dispose of canvas and remove event listeners when component unmounts
    return () => {
      console.log("Cleaning up Fabric.js...");
      fabricRef.current?.dispose();
      window.removeEventListener("resize", handleResizeEvent);
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [isLoggedIn,deleteShapeFromStorage, redo, syncShapeInStorage, undo]);

  // Render the canvas when canvasObjects changes
  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => renderCanvas({ fabricRef, canvasObjects, activeObjectRef }), 100);
    }
  }, [isLoggedIn, canvasObjects,deleteShapeFromStorage, redo, syncShapeInStorage, undo]);

  

  return (
    <main className="h-screen overflow-hidden">
      {!isLoggedIn ? (
        isSignUpMode ? (
          <SignUp setIsLoggedIn={setIsLoggedIn} toggleAuthMode={toggleAuthMode} />
        ) : (
          <SignIn setIsLoggedIn={setIsLoggedIn} toggleAuthMode={toggleAuthMode} />
        )
      ) : (
        <>
          <Navbar
            imageInputRef={imageInputRef}
            activeElement={activeElement}
            handleImageUpload={(e: any) => {
              e.stopPropagation();
              handleImageUpload({
                file: e.target.files[0],
                canvas: fabricRef as any,
                shapeRef,
                syncShapeInStorage,
              });
            }}
            handleActiveElement={handleActiveElement}
          />
          <section className="flex h-full flex-row">
            <LeftSidebar allShapes={Array.from(canvasObjects)} />
            <Live canvasRef={canvasRef} undo={undo} redo={redo} />
            <RightSidebar
              elementAttributes={elementAttributes}
              setElementAttributes={setElementAttributes}
              fabricRef={fabricRef}
              isEditingRef={isEditingRef}
              activeObjectRef={activeObjectRef}
              syncShapeInStorage={syncShapeInStorage}
            />
          </section>
        </>
      )}
    </main>
  );
}  


