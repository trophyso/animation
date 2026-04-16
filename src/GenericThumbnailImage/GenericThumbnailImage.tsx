import { getInputProps } from "remotion";
import { ThumbnailImage } from "../components/ThumbnailImage";

export const GenericThumbnailImage: React.FC = () => {
    const { title: titleInput, imageUrl, imageBorder } = getInputProps();
    let title = titleInput;

    if (!title) {
        title = "Enter title here";
    }

    return (
        <ThumbnailImage
            title={title as string}
            imageUrl={imageUrl as string}
            imageBorder={imageBorder !== false}
        />
    );
};