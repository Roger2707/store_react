
import { homeSlider } from "../../../app/utils/helper"
import { Slider } from "../../ui/Layout/Slider"
import { Container } from "../../ui/Layout/Container"
import { BestSeller } from "./BestSeller"

export const Home = () => {

    return (
        <div>
            <Slider data = {homeSlider} />
            <Container>
                <BestSeller/>
            </Container>
        </div>
    )
}