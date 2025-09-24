
import { homeSlider } from "../../../app/utils/helper"
import { Slider } from "../../UI/Layout/Slider"
import { Container } from "../../UI/Layout/Container"
import { BestSeller } from "./BestSeller"
import { Banner } from "./Banner"
import { AboutUs } from "./AboutUs"
import { Branch } from "./Branch"

export const Home = () => {

    return (
        <div>
            <Banner/>
            <Slider data = {homeSlider} />
            <Container>
                <BestSeller/>
                <AboutUs/>
                <Branch/>
            </Container>
        </div>
    )
}