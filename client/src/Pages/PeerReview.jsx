import React, {  useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import Form from "react-bootstrap/Form";
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom";
import '../Styles/PeerReview.css'; 

function PeerReview() {
  const [user,setUser]=useState(()=>{
      const savedItem= localStorage.getItem("Logged in User")
      const parsedItem= JSON.parse(savedItem)
      return parsedItem ||"" //Returns the parsed item or null if nothing exists
    });
 const [searchParams]= useSearchParams();
    
  const student_username=user.username;
  const navigate = useNavigate();
   //Handles reading the input field of the form
  const userID = searchParams.get("user_id")
  const userAuthor = searchParams.get("user_author")

  const [review, setReview] = useState({
    cooperation: "",
    coop_comment: "",
    conceptual: "",
    concept_comment: "",
    practical: "",
    practical_comment: "",
    work_ethic: "",
    we_comment: "",
    user_id:"",
    user_author:"",
  });


  
  const handleChange=(event)=>{
    
    setReview((prev)=>({...prev,[event.target.name]:event.target.value,user_id:userID,user_author:userAuthor}))
  }

  const submitForm = async event => {
    event.preventDefault();
    try{
        console.log(review)
        
   
        console.log(`Attempting to submit review for user id= ${userID}`)
        await axios.post("http://localhost:8080/submit_review",review)
        
        navigate("/Peer_Review_Confirmation");
      }
      catch(err)
      {
        console.log(err)
      }
    }
    

  return (
    <>
    <div>
      <Header />
      <Navigation />
      <form onSubmit={submitForm}>
        <Form.Group>
            <table>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                    </tr>
                    <tr>
                        <th className="entities">
                            <h3>Cooperation</h3>
                            <textarea 
                                onChange={handleChange}
                                placeholder="Cooperation Comments (Optional):"
                                name="coop_comment"
                                value={review.coop_comment}
                                maxLength="255"
                                rows="3"
                            />
                        </th>
                        <th><label><input id="c1" type="radio" value="1" name="cooperation" onChange={handleChange} required/></label></th>
                        <th><label><input type="radio" value="2" name="cooperation" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="3" name="cooperation" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="4" name="cooperation" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="5" name="cooperation" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="entities">
                            <h3>Conceptual Contribution</h3>
                            <textarea 
                                onChange={handleChange}
                                placeholder="Conceptual Contribution Comments (Optional):"
                                name="concept_comment"
                                value={review.concept_comment}
                                maxLength="255"
                                rows="3"
                            />
                        </th>
                        <th><label><input type="radio" value="1" name="conceptual" onChange={handleChange} required/></label></th>
                        <th><label><input type="radio" value="2" name="conceptual" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="3" name="conceptual" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="4" name="conceptual" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="5" name="conceptual" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="entities">
                            <h3>Practical Contribution</h3>
                            <textarea 
                                onChange={handleChange}
                                placeholder="Practical Contribution Comments (Optional):"
                                name="practical_comment"
                                value={review.practical_comment}
                                maxLength="255"
                                rows="3"
                            />
                        </th>
                        <th><label><input type="radio" value="1" name="practical" onChange={handleChange} required/></label></th>
                        <th><label><input type="radio" value="2" name="practical" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="3" name="practical" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="4" name="practical" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="5" name="practical" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="entities">
                            <h3>Work Ethic</h3>
                            <textarea 
                                onChange={handleChange}
                                placeholder="Work Ethic Comments (Optional):"
                                name="we_comment"
                                value={review.we_comment}
                                maxLength="255"
                                rows="3"
                            />
                        </th>
                        <th><label><input type="radio" value="1" name="work_ethic" onChange={handleChange} required/></label></th>
                        <th><label><input type="radio" value="2" name="work_ethic" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="3" name="work_ethic" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="4" name="work_ethic" onChange={handleChange}/></label></th>
                        <th><label><input type="radio" value="5" name="work_ethic" onChange={handleChange}/></label></th>
                    </tr>
                </tbody>
            </table>
        </Form.Group>
        <button className="CAButton" type="submit">
            Submit Review
        </button>
      </form>
      <Footer />
    </div>
    </>
  );
}
export default PeerReview;