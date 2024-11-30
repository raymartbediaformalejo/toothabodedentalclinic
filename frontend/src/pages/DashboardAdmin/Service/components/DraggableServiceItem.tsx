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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: serviceId });

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
      className={`${className} select-none`}
      // className="task"
    >
      <RiDraggable className="text-[28px]" />
      <p className="overflow-hidden text-nowrap text-ellipsis">{title}</p>
    </div>
  );
};
