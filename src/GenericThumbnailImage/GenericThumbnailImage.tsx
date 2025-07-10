import { getInputProps } from "remotion";
import { ThumbnailImage } from "../components/ThumbnailImage";

export const GenericThumbnailImage: React.FC = () => {
    let { title } = getInputProps();

    if (!title) {
        title = "Enter title here";
    }

    return (
        <ThumbnailImage title={title as string} imageUrl="assets/duolingo_energy.png" />
    );
};