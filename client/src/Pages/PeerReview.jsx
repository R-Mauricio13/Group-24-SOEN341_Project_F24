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
    const form = event.target;

  // Check if the form is valid (ensures that required fields are filled out)
  if (form.checkValidity()) {
    try {
      console.log(review);
      console.log(`Attempting to submit review for user id= ${userID}`);
      
      // Proceed with form submission if valid
      await axios.post("http://localhost:8080/submit_review", review);

      // Navigate to the confirmation page after successful submission
      navigate("/Peer_Review_Confirmation");
    } catch (err) {
      console.log("Form submission error:", err);
    }
  } else {
    console.log("Form is invalid. Please fill in all required fields.");
  }
};
    

  return (
    <>
    <div>
      <Header />
      <Navigation />
      <form data-testid="peer-review-form" onSubmit={submitForm}>
        <Form.Group>
            <table className="PRtable">
                <tbody>
                    <tr>
                        <th className="PRth"></th>
                        <th className="PRth">1</th>
                        <th className="PRth">2</th>
                        <th className="PRth">3</th>
                        <th className="PRth">4</th>
                        <th className="PRth">5</th>
                    </tr>
                    <tr>
                        <th className="PRth entities">
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
                        <th className="PRth"><label className="PRlabel"><input id="c1" type="radio" value="1" name="cooperation" aria-label="cooperation 1" onChange={handleChange} required/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="2" name="cooperation" aria-label="cooperation 2" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="3" name="cooperation" aria-label="cooperation 3" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="4" name="cooperation" aria-label="cooperation 4" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="5" name="cooperation" aria-label="cooperation 5" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="Prth entities">
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
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="1" name="conceptual" onChange={handleChange} required/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="2" name="conceptual" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="3" name="conceptual"  aria-label="conceptual 3" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="4" name="conceptual" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="5" name="conceptual" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="PRth entities">
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
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="1" name="practical" onChange={handleChange} required/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="2" name="practical" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="3" name="practical"  aria-label="practical 3" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="4" name="practical" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="5" name="practical" onChange={handleChange}/></label></th>
                    </tr>
                    <tr>
                        <th className="PRth entities">
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
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="1" name="work_ethic" onChange={handleChange} required/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="2" name="work_ethic" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="3" name="work_ethic" aria-label="work ethic 3" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="4" name="work_ethic" onChange={handleChange}/></label></th>
                        <th className="PRth"><label className="PRlabel"><input type="radio" value="5" name="work_ethic" onChange={handleChange}/></label></th>
                    </tr>
                </tbody>
            </table>
        </Form.Group>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button className="CAButton" style={{width:'10%'}} type="submit">
            Submit Review
          </button>
        </div>
      </form>
      <Footer />
    </div>
    </>
  );
}
export default PeerReview;