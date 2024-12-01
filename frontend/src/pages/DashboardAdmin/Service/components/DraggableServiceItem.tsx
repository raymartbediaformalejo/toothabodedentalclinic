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
      className={`relative select-none border flex items-center justify-start gap-1 rounded-[6px] pt-3 pb-3 pr-3 pl-1 overflow-hidden text-ellipsis text-nowrap ${
        isDragging
          ? "bg-primary-50 z-10 border-primary-500 text-primary-700"
          : "bg-neutral-100 text-neutral-800 border-neutral-300 "
      } ${className}`}
    >
      <RiDraggable className="h-[24px] w-[24px] absolute" />
      <p className="relative top-0  left-[26px] ">{title}</p>
    </div>
  );
};
