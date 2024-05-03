import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import EmptyCard from "../components/EmptyCard"
import ListItem from '../components/ListItemBootstrap';
import styles from "../css/LandingPage.module.css"

export default function Landing() {
    // const clientDetails = useLoaderData()
    // console.log(clientDetails)
    const [expiringFoods, setExpiringFoods] = useState([])
    const [lowestFoods, setLowestFoods] = useState([])
    const[view, setView] = useState("expiring");
    const [expiringLoading,SetExpiringLoading] = useState(true);
    const [lowestLoading,SetLowestLoading] = useState(true);

    useEffect(()=> {
        (async ()=> {
            SetExpiringLoading(true);
            const res = await fetch("/api/foods/expiring", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting expiring foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setExpiringFoods(resJson.expiringFoods)
            SetExpiringLoading(false);
        })()
    },[])

    useEffect(()=> {
        (async ()=> {
            SetLowestLoading(true);
            const res = await fetch("/api/foods/lowest", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting lowest quantity foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setLowestFoods(resJson.lowestQuantityFoods)
            SetLowestLoading(false);
        })()
    },[])

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
    // Sort by quantity
    function sortArrayByQuantity(arr) {
        arr.sort((a, b) => {
            const quantA = a.quantity !== "N/A" ? a.quantity : Number.NEGATIVE_INFINITY;
            const quantB = b.quantity !== "N/A" ? b.quantity : Number.NEGATIVE_INFINITY;
            return getLarger(quantA, quantB);
        });
    }
    function sortArrayByExpirationDate(arr) {
        arr.sort((a, b) => {
            const expA = a.expirationDate !== "N/A" ? a.expirationDate : Number.NEGATIVE_INFINITY;
            const expB = b.expirationDate !== "N/A" ? b.expirationDate : Number.NEGATIVE_INFINITY;
            return getLarger(expA, expB);
        });
    }

    return (
      <div  className={styles.centerrow} >
        {/* <h3>Food</h3>
        <ListItem image="https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg"
        description="A red fruit/vegitable dddddddddddddddddddddddddddddddd" name="tomato"></ListItem> */}   
        {/* <br />      */}
        <Tabs
        defaultActiveKey="alphabetical"
        id="uncontrolled-tab-example"
        justify
        className={styles.tabbackground} 
        >
            <Tab eventKey="alphabetical" title="All" className={styles.tab} onClick={sortArrayByName(lowestFoods)}>
                <Container>
                    {lowestLoading ? (
                        <>
                            <EmptyCard  feildnum= "2" ></EmptyCard>
                        </>
                    ) : (
                        <>
                        { lowestFoods.map(e=>
                            <ListItem 
                                key={e._id}
                                id={e._id}
                                name={e.name} 
                                image={e.image}
                                quantity={e.quantity}
                                viewLink={'/food/'+e._id}
                                editLink={'/food/edit/'+e._id}
                                date = {e.expirationDate}
                            />)
                        }
                        </>
                    )}
                </Container>
            </Tab>
            <Tab eventKey="lowQuantity" title="Low Quantity"  className={styles.tab} onClick={sortArrayByQuantity(lowestFoods)}>
            
                <Container>
                    {lowestLoading ? (
                        <>
                            <EmptyCard  feildnum= "2" ></EmptyCard>
                        </>
                    ) : (
                        <>
                        { lowestFoods.map(e=>
                            <ListItem 
                                key={e._id}
                                id={e._id}
                                name={e.name} 
                                image={e.image}
                                quantity={e.quantity}
                                viewLink={'/food/'+e._id}
                                editLink={'/food/edit/'+e._id}
                                date = {e.expirationDate}
                            />)
                        }
                        </>
                    )}
                </Container>
            </Tab>
            <Tab eventKey="expringSoon" title="Expiring Soon "  className={styles.tab} onClick={sortArrayByExpirationDate(lowestFoods)}>
                
                <Container>
                    {expiringLoading ? (
                        <>
                            <EmptyCard  feildnum= "2" ></EmptyCard>
                        </>
                    ) : (
                        <>
                            { expiringFoods.map(e=>
                                <ListItem  
                                key={e._id}
                                id={e._id}
                                name={e.name} 
                                image={e.image}
                                quantity={e.quantity}
                                viewLink={'/food/'+e._id}
                                editLink={'/food/edit/'+e._id}
                                date = {e.expirationDate}
                                />)
                            }
                        </>
                    )}
                </Container>
            </Tab>
        </Tabs>
      </div>
    );
}

