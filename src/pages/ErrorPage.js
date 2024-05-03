import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import '../css/page.css';

export default function ErrorPage() {
  let navigate = useNavigate();
  
  return (
    <div className="body">
        <div>
          <h1>Let Me Cook Link Not Found!</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
    </div>
  )
}