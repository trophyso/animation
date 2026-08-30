/** G2 logo star / mark fill — see Trophy marketing `g2.svg` */
const G2_BRAND_COLOR = "#FF492C";
const G2_STAR_EMPTY = "rgba(255, 73, 44, 0.22)";

/** Single G2 star path, normalized to a 16×15 viewBox */
const G2_STAR_PATH =
  "M8 0L9.7961 5.52786H15.6085L10.9062 8.9443L12.7023 14.4721L8 11.0557L3.2977 14.4721L5.0938 8.9443L0.3915 5.52786H6.2039L8 0Z";

const G2Star: React.FC<{
  size: number;
  filled?: boolean;
}> = ({ size, filled = true }) => {
  return (
    <svg
      viewBox="0 0 16 15"
      width={size}
      height={(size * 15) / 16}
      fill="none"
    >
      <path
        d={G2_STAR_PATH}
        fill={filled ? G2_BRAND_COLOR : G2_STAR_EMPTY}
      />
    </svg>
  );
};

const G2Mark: React.FC<{ size: number }> = ({ size }) => {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none">
      <path
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
        fill={G2_BRAND_COLOR}
      />
      <path
        d="M14.3281 7.66013H12.6201C12.6661 7.39213 12.8321 7.24213 13.1681 7.07213L13.4821 6.91213C14.0441 6.62413 14.3441 6.29813 14.3441 5.76613C14.3441 5.43213 14.2141 5.16813 13.9561 4.97813C13.6981 4.78813 13.3941 4.69413 13.0381 4.69413C12.7627 4.69089 12.4924 4.76804 12.2601 4.91613C12.0261 5.06013 11.8521 5.24613 11.7441 5.47813L12.2381 5.97413C12.4301 5.58613 12.7081 5.39613 13.0741 5.39613C13.3841 5.39613 13.5741 5.55613 13.5741 5.77813C13.5741 5.96413 13.4821 6.11813 13.1261 6.29813L12.9241 6.39613C12.4861 6.61813 12.1821 6.87213 12.0061 7.16013C11.8301 7.44813 11.7441 7.81013 11.7441 8.24813V8.36813H14.3281V7.66013Z"
        fill="#fff"
      />
      <path
        d="M14.1004 9.18414H11.2724L9.8584 11.6321H12.6864L14.1004 14.0821L15.5144 11.6321L14.1004 9.18414Z"
        fill="#fff"
      />
      <path
        d="M10.1022 13.2659C8.30218 13.2659 6.83618 11.7999 6.83618 9.99989C6.83618 8.19989 8.30218 6.73389 10.1022 6.73389L11.2202 4.39589C10.852 4.32268 10.4776 4.28583 10.1022 4.28589C6.94618 4.28589 4.38818 6.84389 4.38818 9.99989C4.38818 13.1559 6.94618 15.7139 10.1022 15.7139C11.3116 15.7162 12.4902 15.3322 13.4662 14.6179L12.2302 12.4739C11.6389 12.9847 10.8836 13.2658 10.1022 13.2659Z"
        fill="#fff"
      />
    </svg>
  );
};

const StarSlot: React.FC<{
  rating: number;
  index: number;
  size: number;
}> = ({ rating, index, size }) => {
  const filled = rating >= index + 1;
  const half = !filled && rating >= index + 0.5;

  if (half) {
    return (
      <div
        style={{
          position: "relative",
          width: size,
          height: (size * 15) / 16,
        }}
      >
        <G2Star size={size} filled={false} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <G2Star size={size} filled />
        </div>
      </div>
    );
  }

  return <G2Star size={size} filled={filled} />;
};

type G2RatingProps = {
  rating: number;
  starSize?: number;
  markSize?: number;
};

export const G2Rating: React.FC<G2RatingProps> = ({
  rating,
  starSize = 32,
  markSize = 36,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <G2Mark size={markSize} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <StarSlot rating={rating} index={0} size={starSize} />
        <StarSlot rating={rating} index={1} size={starSize} />
        <StarSlot rating={rating} index={2} size={starSize} />
        <StarSlot rating={rating} index={3} size={starSize} />
        <StarSlot rating={rating} index={4} size={starSize} />
      </div>
    </div>
  );
};
