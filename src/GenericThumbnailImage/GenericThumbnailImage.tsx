import { ThumbnailImage } from "../components/ThumbnailImage";

type GenericThumbnailImageProps = {
    title?: string;
    imageUrl?: string;
    imageBorder?: boolean;
};

export const GenericThumbnailImage: React.FC<GenericThumbnailImageProps> = ({
    title: titleInput,
    imageUrl = "",
    imageBorder,
}) => {
    const title = titleInput || "Enter title here";

    return (
        <ThumbnailImage
            title={title}
            imageUrl={imageUrl}
            imageBorder={imageBorder !== false}
        />
    );
};