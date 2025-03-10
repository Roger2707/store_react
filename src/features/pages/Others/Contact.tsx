import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify"

export const Contact = () => {

    const handleClick = () => {
        toast.success('Test Test Test Test Test Test !!!', {
            icon: <i className="custom-icon"><FaCheck /></i>, 
          });
    }

    return (
        <div>
            <button onClick={handleClick} >Click</button>
        </div>
    )
}