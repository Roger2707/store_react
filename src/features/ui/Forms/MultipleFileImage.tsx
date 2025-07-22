import { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
    isClearMode: boolean;
    value: string | File[] | null | undefined;
    onGetDataChange: (e: any) => void;
}

export interface FileWithPreview {
    file: File;
    preview: string;
}

export const MultipleFileImage = ({ isClearMode, value, onGetDataChange }: Props) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray: FileWithPreview[] = Array.from(files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setSelectedFiles(fileArray);
        onGetDataChange(Array.from(files));
    }

    useEffect(() => {
        isClearMode && setSelectedFiles([]);
    }, [isClearMode])

    useEffect(() => {
        let previews: FileWithPreview[] = [];

        if (typeof value === 'string') {
            const imageUrls = value.split(',');
            previews = imageUrls.map((url) => ({
                file: {} as File,
                preview: url
            }));
        } else if (Array.isArray(value)) {
            previews = value.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            }));
        }

        setSelectedFiles(previews);
    }, [value]);

    return (
        <Style>
            <input
                type="file"
                multiple
                id="imageUpload"
                accept="image/*"
                onChange={handleChangeImage}
            />
            <label htmlFor="imageUpload" ></label>
            <div className="preview">
                {selectedFiles.map((item, index) => (
                    <img
                        key={index}
                        src={item.preview}
                        alt={`Preview ${index}`}
                    />
                ))}
            </div>
        </Style>
    )
}

const Style = styled.div`
    input {
        display: none;
    }

    label {
        display: inline-block;
        color: #fff;
        background-color: transparent;
        border-radius: 5px;
        cursor: pointer;
        position: absolute;
        width: 39%;
        height: 15vh;
    }

    .preview {
        margin-top: 1vh;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-row-gap: 0.5vh;
        column-gap: 0.5vw;
        height: 160px;
        background-color: #ccc;
        border: 2px solid darkgray;

        img {
            display: inline-block;
            width: 100%;
            height: 70px;
            cursor: pointer;
            image-rendering: optimizeQuality;
        }
    }
`