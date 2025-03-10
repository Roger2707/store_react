import React, { useState } from "react";
import styled from "styled-components"

interface Props {
    value: string;
    onGetDataChange: (e:any) => void;
}

export const FileImage = ({value, onGetDataChange}: Props) => {

    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [, setFile] = useState<File | undefined>(undefined);

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; //
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string); // Lưu URL để hiển thị hình ảnh
            };
            reader.readAsDataURL(file);
            
            setFile(file);
            onGetDataChange(file || value);
        } else {
            setPreviewUrl('');
        }
    }

    return (
        <Style>
            <input
                type="file"
                id="imageUpload"
                accept="image/*" 
                onChange={handleChangeImage}
            />
            <label htmlFor="imageUpload" >Upload</label>
            <div className="preview" >
                {(previewUrl || value )
                    &&
                <img src={previewUrl || value} alt="selected" />
                }
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

        width: 50%;
        height: 18vh;
        border: 1px solid #333;
        background-color: #ccc;
        
        img {
            width: 100%;
            height: 100%;
        }
    }
`