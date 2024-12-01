import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDraggable } from "react-icons/ri";
import { UniqueIdentifier } from "@dnd-kit/core";

type DraggableServiceItemProp = React.HTMLAttributes<HTMLDivElement> & {
  serviceId: UniqueIdentifier;
  title: string;
};

export const DraggableServiceItem = ({
  serviceId,
  title,
  className,
}: DraggableServiceItemProp) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: serviceId });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`select-none border flex items-center gap-2 rounded-[6px] p-3 ${
        isDragging
          ? "bg-primary-50 z-10 border-primary-500 text-primary-700"
          : "bg-neutral-100 text-neutral-800 border-neutral-300 "
      } ${className}`}
    >
      <RiDraggable className="text-[28px]" />
      <p className="overflow-hidden text-nowrap text-ellipsis">{title}</p>
    </div>
  );
};
