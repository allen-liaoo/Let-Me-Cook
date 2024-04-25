import { useLoaderData } from 'react-router-dom'
import ListItem from '../components/ListItem';
export default function Landing() {
    const clientDetails = useLoaderData()
    console.log(clientDetails)
    return (
      <div>
        <h3>Food</h3>
        <ListItem image="https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg"
        description="A red fruit/vegitable dddddddddddddddddddddddddddddddd" name="tomato"></ListItem>
        <h3>Recently purchased</h3>
      </div>
    );
}