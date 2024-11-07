import { useEffect, useState } from "react";
import axios from "axios";

//Will display the summaries of the peer reviews from all students
function Peers_Summary() {
  const [peer_review, setPeerReview] = useState([]);

  const [student_average_score,setAverage]= useState([]);


  //Fetching the peer_reviews and storing the information into peer_review array
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8080/peer_reviews");
        const data = await response.json();
        setPeerReview(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching peer reviews", error);
      }
    };
    fetchReviews();
  }, []);

 
  
  //Fetching the review counts list
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/peer_reviews/review-counts");
        const data = await response.json();
        setAverage(data);
      } catch (error) {
        console.error("Error fetching student members:", error);
      }
    };

    fetchReviewCount();
  }, []);
  return (
    <div>
      <table>
        <tr>
          <th scope="col">Student ID</th>
          <th scope="col">Last Name</th>
          <th scope="col">First Name</th>
          <th scope="col">Team</th>
          <th scope="col">Cooperation</th>
          <th scope="col">Conceptual</th>
          <th scope="col">Practical</th>
          <th scope="col">Work Ethic</th>
          <th scope="col">Average</th>
          <th scope="col">Peers who responded</th>
        </tr>
        {peer_review.map((student) => (
          <tr key={student.user_id}>
            <th scope="row">{student.user_id}</th>
            <td>{student.last_name}</td>
            <td>{student.first_name}</td>
            <td>{student.team_name}</td>
            <td>{student.Cooperation}</td>
            <td>{student.Conceptional_Contribution}</td>
            <td>{student.Practical_Contribution}</td>
            <td>{student.Work_Ethic}</td>
            <td>Add in average</td>
           {student_average_score.map((score)=>(
            <td>{score.review_count}</td>
           ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Peers_Summary;
