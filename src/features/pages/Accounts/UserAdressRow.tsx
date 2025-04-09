import styled from "styled-components"
import { UserAddressDTO } from "../../../app/models/User"

interface Props {
    userAddress : UserAddressDTO
}

export const UserAddressRow = ({userAddress} : Props) => {
    return (
        <Row>
            <div className="row-actions" >
                <button>+</button>
                <button>-</button>
            </div>
            
            <span>{userAddress.city}</span>
        </Row>
    )
}

const Row = styled.div`
    .row-action {
        display: inline-block;
    }

    

`