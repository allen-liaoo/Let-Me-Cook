import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import EmptyCard from "../components/EmptyCard"
import FoodItem from '../components/FoodItem';
import Layout from "../css/ItemPageLayout.module.css"
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
            setLowestFoods(resJson.lowestQuantityFoods);
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

    // Sorts by name
    function sortArrayByName(arr) {
        const sortedArr = [...arr]; // Copy array
        sortedArr.sort((a, b) => {
            return getLarger(a.name.toUpperCase(), b.name.toUpperCase());
        });
        return sortedArr;
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
                            <div>
                            <EmptyCard feildnum="2"></EmptyCard>
                            <EmptyCard feildnum="2"></EmptyCard>
                            <EmptyCard feildnum="2"></EmptyCard>
                            </div>
                            : sortArrayByName(lowestFoods).map(e => <FoodItem food={e} />)
                        }
                         <div className ={Layout.centerrow}>
                        {!lowestFoods.length?<div className ={Layout.center}><h2>No Food items in pantry</h2>
                        <p >if you add a food item using the add button it will show up here </p></div>:
                        <div></div>}
                    </div>
                    </Container>
                </Tab>
                <Tab eventKey="lowQuantity" title="Low Quantity" className={styles.tab} onClick={() => setLowestFoods(lowestFoods)}>

                    <Container>
                        {lowestLoading ?
                             <div>
                             <EmptyCard feildnum="2"></EmptyCard>
                             <EmptyCard feildnum="2"></EmptyCard>
                             <EmptyCard feildnum="2"></EmptyCard>
                             </div>
                            : lowestFoods.map(e => <FoodItem food={e} />)
                        }
                    </Container>
                    <div className ={Layout.centerrow}>
                        {!lowestFoods.length?<div className ={Layout.center}><h2>No Food items in pantry</h2>
                        <p >if you add a food item using the add button it will show up here </p></div>:<div></div>}
                    </div>
                </Tab>
                <Tab eventKey="expringSoon" title="Expiring Soon " className={styles.tab} onClick={() => setExpiringFoods(expiringFoods)}>

                    <Container>
                        { expiringLoading?
                             <div>
                             <EmptyCard feildnum="2"></EmptyCard>
                             <EmptyCard feildnum="2"></EmptyCard>
                             <EmptyCard feildnum="2"></EmptyCard>
                             </div>
                            : expiringFoods.map(e => <FoodItem food={e} />)
                        }
                        <div className ={Layout.centerrow}>
                        {!expiringFoods.length?<div className ={Layout.center}><h2>No Food items in pantry</h2>
                        <p >if you add a food item using the add button it will show up here </p></div>:<div></div>}
                    </div>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    );
}
