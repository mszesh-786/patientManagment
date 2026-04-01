import { useState } from "react";

type RatingProps = {
  value?: number;
  emptyStarIcon?: string;
  halfFilledStarIcon?: string;
  filledStarIcon?: string;
  steps?: 1 | 0.5;
};

const Rating = ({
  value = 0,
  emptyStarIcon,
  halfFilledStarIcon,
  filledStarIcon,
  steps = 1,
}: RatingProps) => {
  const [rating, setRating] = useState(value);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const getIcon = (index: number) => {
    const starNumber = index + 1;

    if (displayValue >= starNumber) return filledStarIcon;
    if (steps === 0.5 && displayValue === index + 0.5) {
      return halfFilledStarIcon;
    }

    return emptyStarIcon;
  };

  const getValueFromPosition = (
    event: React.MouseEvent<HTMLImageElement>,
    index: number
  ) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;

    if (steps === 0.5) {
      return x <= width / 2 ? index + 0.5 : index + 1;
    }

    return index + 1;
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLImageElement>,
    index: number
  ) => {
    const hover = getValueFromPosition(event, index);
    setHoverValue(hover);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLImageElement>,
    index: number
  ) => {
    const newValue = getValueFromPosition(event, index);
    const nextRating = rating === newValue ? 0 : newValue;

    setRating(nextRating);
    setHoverValue(null);
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={getIcon(index)}
          alt={`Rating ${index + 1}`}
          onClick={(e) => handleClick(e, index)}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={() => setHoverValue(null)}
          style={{ cursor: "pointer", width: 30, height: 30 }}
        />
      ))}
    </div>
  );
};

export default Rating;