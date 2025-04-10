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
            <label htmlFor="imageUpload" >Choose Image</label>
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
    position: relative;
    input {
        display: none;
    }

    label {
        display: inline-block;
        padding: 0.5vh 0.5vw;
        color: #fff;
        background-color: #5f5c5c;
        
        position: absolute;
        bottom: 1%;
        left: 25%;
        width: 50%;
        height: 10%;
        z-index: 100;
        opacity: 0;
        
        text-align: center;
        font-size: 0.6rem;
        font-style: italic;
        letter-spacing: 1px;

        border-bottom-left-radius: 80%;
        border-bottom-right-radius: 80%;

        &:hover {
            opacity: 1;
            cursor: pointer;
            transition: 0.3s;
        }
    }

    .preview {
        margin-top: 1vh;

        width: 100%;
        height: 25vh;
        border: 1px solid #333;
        background-color: #ccc;
        border-radius: 50%;
        
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
`