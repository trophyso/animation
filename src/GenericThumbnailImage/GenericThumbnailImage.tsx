import { ThumbnailImage } from "../components/ThumbnailImage";
import type { Sky } from "../og/constants";
import type { PersonKey } from "../og/people";

type GenericThumbnailImageProps = {
    title?: string;
    sky?: Sky;
    person?: PersonKey;
};

export const GenericThumbnailImage: React.FC<GenericThumbnailImageProps> = ({
    title: titleInput,
    sky,
    person,
}) => {
    const title = titleInput || "Enter title here";

    return <ThumbnailImage title={title} sky={sky} person={person} />;
};
