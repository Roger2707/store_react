import { useState } from "react";
import styled from "styled-components";

interface Props {
    value: string;
    onGetDataChange: (e:any) => void;
}

export interface FileWithPreview {
    file: File;
    preview: string;
  }

export const MultipleFileImage = ({value, onGetDataChange}: Props) => {
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


    return (
        <Style>
            <input
                type="file"
                multiple
                id="imageUpload"
                accept="image/*" 
                onChange={handleChangeImage}
            />
            <label htmlFor="imageUpload" >Uploads:</label>
            <div className="preview" >
                {
                (selectedFiles.length === 0 && value !== '') ?
                Array.from(value.split(',')).map((item, index) => (
                    <img 
                        key={index}
                        src={item}
                        alt={`Preview ${index}`}
                    />
                ))
                :
                selectedFiles.map((item, index) => (
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

const Style = styled.div `
    input {
        display: none;
    }

    label {
        display: inline-block;
        padding: 0.5vh 0.5vw;
        color: #fff;
        background-color: #191970;
        border-radius: 5px;
        cursor: pointer;
    }

    .preview {
        margin-top: 1vh;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        column-gap: 5px;
        row-gap: 5px;
        height: 80%;
        background-color: #ccc;
        border: 2px solid darkgray;

        img {
            width: 100%;
            height: 100%;
        }
    }
`