import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import EmptyCard from "../components/EmptyCard"
import FoodItem from '../components/FoodItem';
import styles from "../css/LandingPage.module.css"

export default function Landing() {
    const [expiringFoods, setExpiringFoods] = useState([])
    const [lowestFoods, setLowestFoods] = useState([])
    const [view, setView] = useState("expiring");
    const [expiringLoading, setExpiringLoading] = useState(true);
    const [lowestLoading, setLowestLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setExpiringLoading(true);
            const res = await fetch("/api/foods/expiring", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting expiring foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setExpiringFoods(resJson.expiringFoods)
            setExpiringLoading(false);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setLowestLoading(true);
            const res = await fetch("/api/foods/lowest", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting lowest quantity foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setLowestFoods(resJson.lowestQuantityFoods)
            setLowestLoading(false);
        })()
    }, [])

    // Helper function for sorting
    function getLarger(a, b){
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }

    // Sort by name
    function sortArrayByName(arr) {
        arr.sort((a, b) => {
            return getLarger(a.name.toUpperCase(), b.name.toUpperCase());
        });
    }

    return (
        <div className={styles.centerrow}>
            <Tabs
                defaultActiveKey="alphabetical"
                id="uncontrolled-tab-example"
                justify
                className={styles.tabbackground}
            >
                <Tab eventKey="alphabetical" title="All" className={styles.tab} onClick={() => sortArrayByName(lowestFoods)}>
                    <Container>
                        {lowestLoading ?
                            <EmptyCard feildnum="2"></EmptyCard>
                            : lowestFoods.map(e => <FoodItem food={e} />)
                        }
                    </Container>
                </Tab>
                <Tab eventKey="lowQuantity" title="Low Quantity" className={styles.tab} onClick={() => setLowestFoods(lowestFoods)}>

                    <Container>
                        {lowestLoading ?
                            <EmptyCard feildnum="2"></EmptyCard>
                            : lowestFoods.map(e => <FoodItem food={e} />)
                        }
                    </Container>
                </Tab>
                <Tab eventKey="expringSoon" title="Expiring Soon " className={styles.tab} onClick={() => setExpiringFoods(expiringFoods)}>

                    <Container>
                        {expiringLoading ?
                            <EmptyCard feildnum="2"></EmptyCard>
                            : expiringFoods.map(e => <FoodItem food={e} />)
                        }
                    </Container>
                </Tab>
            </Tabs>
        </div>
    );
}
