import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragStartEvent
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import Container from "./container";
import { Item, ItemProps } from "./SortableItem";
//import Announcements from "./announcements";

//https://codesandbox.io/p/sandbox/dnd-kit-sortable-example-yhwz3f?file=%2Fsrc%2FApp.jsx

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row"
};

export default function DragDropSave() {
  
  const [items1, setItems1] = useState<{ [key: string]: ItemProps[] }>({
    root: [{ id: uuidv4(), label: "Item 1", disable: false }, 
      { id: uuidv4(), label: "Item 2", disable: false }, 
      { id: uuidv4(), label: "Item 3", disable: false }],
    container1: [{ id: uuidv4(), label: "Item 4" }, { id: uuidv4(), label: "Item 5" }, { id: uuidv4(), label: "Item 6" }]
   
  });

  //const testt =uuidv4()
  //console.log('test = ', testt)
  /*
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({
    root: ["1", "2", "3"],
    container1: ["4", "5", "6"],
    container2: ["7", "8", "9"],
    container3: []
   
  });
  */
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 200, tolerance: 1000 }
      //kpham: keep these number big like this. If they are too small, the sensor sometimes will not detect the mouse click on the draggable item
      //Many trials and errors to get the sensor to work
  }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  
    //    console.log('items1 = ', items1)
   
/*
    <Container id="root" items={items.root} />
        <Container id="container1" items={items.container1} />
        <Container id="container2" items={items.container2} />
        <Container id="container3" items={items.container3} />
*/

  const handleSortableItemClick = (item_id: string, container_id: string) => {
    console.log("in App tsx click on item item_id=", item_id);
    //look in items1.root for the index of the item with the item_id
    const item_index = items1[container_id].findIndex((item) => item.id === item_id);
    console.log("item_index=", item_index);
   
    //look for this item in the items1 array using root
    const the_item = items1[container_id].find((item) => item.id === item_id);
    console.log("handleSortableItemClick found item =", the_item);
    if (container_id === "root") {
          if (the_item) {
              setItems1((prev) => ({
                  ...prev,
                  container1: [
                      ...prev.container1.filter((item, index) => index < 1), // filter out the items that are before the new index to avoid duplicates
                      { ...items1.root[item_index], id: uuidv4() },
                      ...prev.container1.filter((item, index) => index >= 1 && index <= prev.container1.length) // filter out the items that are before the new index to avoid duplicates
                  ]
              }));
          }
            //disable the clicked item in the root array
          setItems1((prev) => ({
              ...prev,
              root: prev.root.map((item) => item.id === item_id ? { ...item, disable: true } : item),
          }));

          setItems1((items) => ({
              ...items,
              container1: arrayMove(items.container1, 0, 1)
          }));
    }
    else { //container1
      console.log("container1 clicked,  item label =", the_item?.label);
      //look for the item in the root array with the same label as the_item and enable it
      const item_in_root = items1.root.find((item) => item.label === the_item?.label);
      console.log("item_in_root=", item_in_root);
        if (item_in_root) {
            setItems1((prev) => ({
                ...prev,
                root: prev.root.map((item) => item.label === the_item?.label ? { ...item, disable: false } : item),
            }));
            //at the same time, remove the item from the container1 array
            setItems1((prev) => ({
                ...prev,
                container1: prev.container1.filter((item) => item.id !== item_id)
            }));
        }
    }
    return 
  };

  return (
    <div style={wrapperStyle}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
      
        <div><Container id="container1" 
            items={items1.container1} 
            parent_function={handleSortableItemClick} />
        </div>
        <div><Container id="root" items={items1.root} parent_function={handleSortableItemClick} /></div>
        </div>
        <DragOverlay>{activeId && activeLabel ? <Item id={activeId} label={activeLabel} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );

  function findContainer(id: string) {
   // console.log("findContainer called with id:", id, 'items1 =', items1);
    if (id in items1) {
      //console.log("id ", id, "is in items return id directly");
      return id;
    }

    //return Object.keys(items).find((key) => (items[key as keyof typeof items] as string[]).includes(id));
    return Object.keys(items1).find((key) => 
      (items1[key as keyof typeof items1] as ItemProps[]).some((item) => item.id === id)
    );
    // return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event:DragStartEvent) {
    console.log("handleDragStart called event=", event);
    const { active } = event;
    const { id } = active;

    setActiveId(id.toString());
    //search for active item in the items1 root array
    //let activeItem
    let activeItem = items1.root.find((item) => item.id === id);
    console.log("activeItem=", activeItem);
    if (!activeItem) {
      //search in items1 container1 array
      activeItem = items1.container1.find((item) => item.id === id);
      console.log("activeItem=", activeItem);
    }
    console.log("activeItem label =", activeItem?.label);
    setActiveLabel(activeItem?.label ?? null);
  }

  function handleDragOver(event:any) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    //console.log("handleDragOver called");
    //console.log("active (id):", id);
    //console.log("overId:", overId);
    
    // Find the containers
    const activeContainer = findContainer(id);
    //console.log("after findContainer, activeContainer:", activeContainer);
    const overContainer = findContainer(overId);
    //console.log("after findContainer overContainer:", overContainer);

    if (activeContainer === 'container1' && overContainer === 'root') {
      return
    }
    
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      console.log("Either activeContainer or overContainer is not found, or they are the same. Exiting handleDragOver.");
      return;
    }
 
    setItems1((prev) => {
     // console.log("setItems1 called in handleDragOver prev =", prev);
     // console.log(" find the items in the prev state for activeContainer (root or container1 or container2 ...):");
      const activeItems = prev[activeContainer as keyof typeof items1];

     // console.log("previous state of activeItems:", activeItems);
      //console.log(" find the items in the prev state for overContainer");
      const overItems = prev[overContainer as keyof typeof items1];
     // console.log("previous state of overItems:", overItems);

      //console.log("find the index of the active item in the activeItems array");
      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      //console.log("activeIndex:", activeIndex);

      //console.log("find the index of the over item in the overItems array");
      const overIndex = overItems.findIndex((item) => item.id === overId);
      //console.log("overIndex:", overIndex);
      // active.data.current.clientY > over.rect.offsetTop + over.rect.height;
      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        //console.log('We re at the root droppable of a container newIndex=', newIndex)
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 
          const modifier = isBelowLastItem ? 1 : 0;
          //console.log('isBelowLastItem:', isBelowLastItem)
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          //console.log('newIndex calculated based on isBelowLastItem:', newIndex)
      }
    
      
//  [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id) ],
      //console.log("overContainter slice = ", prev[overContainer].filter((item) => parseInt(item.id) < newIndex));
// ...prev[overContainer].slice(newIndex, prev[overContainer].length)
      const results = { ...prev, 
        [activeContainer]: [...prev[activeContainer].map((item) => item.id === active.id ? { ...item, id: item.id + "0", disable: true } : item ) ] ,
        [overContainer]: [
          ...prev[overContainer].filter((item, index) => index < newIndex), // filter out the items that are before the new index to avoid duplicates
          items1[activeContainer][activeIndex],
          ...prev[overContainer].filter((item, index) =>  index >= newIndex && index <= prev[overContainer].length) // filter out the items that are before the new index to avoid duplicates
        ]
      }
      return results
    });
    
    
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId || "");

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

   // const activeIndex = items1[activeContainer].indexOf(active.id);
    const activeIndex = items1[activeContainer].findIndex((item) => item.id === active.id);
    //const overIndex = items[overContainer].indexOf(overId || "");
    const overIndex = items1[overContainer].findIndex((item) => item.id === overId || item.id === "");
    //console.log('handleDragEnd *** activeIndex:', activeIndex, 'overIndex:', overIndex)

    if (activeIndex !== overIndex) {
      setItems1((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
  }
}
