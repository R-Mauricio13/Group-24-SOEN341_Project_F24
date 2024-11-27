import React,{ useEffect, useState,} from "react";
//Will display the summaries of the peer reviews from all students
function Peers_Summary() {
  const [peer_review, setPeerReview] = useState([]);

  const [student_review_count,setCount]= useState([]);
  const [student_Average_Score,setAverage]= useState([]);
  const [order, setOrder] = useState("ASCENDING");
  
//upong clicking a column you can sort it in ascending or descending order
const sorting = (col) => {
  if (order === "ASCENDING") {
    const sorted = [...student_Average_Score].sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      // Check if both values are numbers, sort numerically if so
      if (!isNaN(valA) && !isNaN(valB)) {
        return Number(valA) - Number(valB);
      }
      
      // If not both numbers, sort as strings
      return String(valA).localeCompare(String(valB));
    });

    setAverage(sorted);
    setOrder("DESCENDING");
  } else {
    const sorted = [...student_Average_Score].sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      // Check if both values are numbers, sort numerically if so
      if (!isNaN(valA) && !isNaN(valB)) {
        return Number(valB) - Number(valA);
      }
      
      // If not both numbers, sort as strings
      return String(valB).localeCompare(String(valA));
    });

    setAverage(sorted);
    setOrder("ASCENDING");
  }
};




 // Function to aggregate scores by user_id
 function getScores(sortedReviews) {
  const userScores = {};

  // Iterate through each review and accumulate scores
  sortedReviews.forEach((element) => {
    const userId = element.user_id;

    // Initialize the user's scores if not already done
    if (!userScores[userId]) {
      userScores[userId] = {
        last_name: element.last_name,
        first_name: element.first_name,
        team_name: element.team_name,
        totalCooperation: 0,
        totalConceptual: 0,
        totalPractical: 0,
        totalWorkEthic: 0,
        review_count:0,
      };
    }

    // Accumulate scores
    userScores[userId].totalCooperation += element.Cooperation;
    userScores[userId].totalConceptual += element.Conceptional_Contribution;
    userScores[userId].totalPractical += element.Practical_Contribution;
    userScores[userId].totalWorkEthic += element.Work_Ethic;
    userScores[userId].review_count+=1;
  });

  // Convert the result into an array for easier use with `setAverage`
  const averageScores = Object.entries(userScores).map(([userId, scores]) => ({
    user_id: userId,
    last_name: scores.last_name,
    first_name: scores.first_name,
    team_name: scores.team_name,
    Cooperation: scores.totalCooperation / scores.review_count,
    Conceptional_Contribution: scores.totalConceptual / scores.review_count,
    Practical_Contribution: scores.totalPractical / scores.review_count,
    Work_Ethic: scores.totalWorkEthic / scores.review_count,
    review_count: scores.review_count,
  }));

  // Update the state with the computed average scores
  setAverage(averageScores);
  console.log(averageScores)

}


  //Fetching the peer_reviews and storing the information into peer_review array
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8080/peer_reviews", {credentials: 'include'});
        const data = await response.json();
        const sortedReviews=data.sort((a,b)=>parseInt(a.user_id)-parseInt(b.user_id))
        setPeerReview( sortedReviews) //sort by user_id increasing
        console.log(sortedReviews)
        getScores(sortedReviews);
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
        const response = await fetch("http://localhost:8080/peer_reviews/review-counts", {credentials: 'include'});
        const data = await response.json();
        setCount(data);
      } catch (error) {
        console.error("Error fetching student members:", error);
      }
    };

    fetchReviewCount();
  }, []);

  //Function to find the student with matching user_id to return the amount of people who review said student
  //  function getReviewScore(student){
  //   const matchedStudent= student_review_count.find((user)=>student.user_id=== user.user_id);
    
  //   return matchedStudent?matchedStudent.review_count:0;
  //  }
   //Function to calculate the total criteria average as totalAverage
   function getTotalAverageScore(student)
   {
      const totalAverage=(student.Cooperation+student.Conceptional_Contribution+student.Practical_Contribution+student.Work_Ethic)/4;
      return totalAverage.toFixed(2);
   }
  return (
    <div className="SVContainer">
      
        <h1>Summary of Student Reviews</h1>
      <table className="table">
      
        <thead>

        <tr>
          <th scope="col" onClick={()=>sorting("user_id")}>Student ID</th>
          <th scope="col" onClick={()=>sorting("last_name")}>Last Name</th>
          <th scope="col" onClick={()=>sorting("first_name")}>First Name</th>
          <th scope="col" onClick={()=>sorting("team_name")}>Team</th>
          <th scope="col" onClick={()=>sorting("Cooperation")}>Cooperation</th>
          <th scope="col" onClick={()=>sorting("Conceptional_Contribution")}>Conceptual</th>
          <th scope="col" onClick={()=>sorting("Practical_Contribution")}>Practical</th>
          <th scope="col" onClick={()=>sorting("Work_Ethic")}>Work Ethic</th>
          <th scope="col">Average</th>
          <th scope="col">Peers who responded</th>
        </tr>
        </thead>
        <tbody>
        {Array.isArray(student_Average_Score) && student_Average_Score.length > 0 ? (
            student_Average_Score.map((student) => (
              <tr key={student.user_id}>
                <th scope="row">{student.user_id}</th>
                <td>{student.last_name}</td>
                <td>{student.first_name}</td>
                <td>{student.team_name}</td>
                <td>{(student.Cooperation).toFixed(2)}</td>
                <td>{(student.Conceptional_Contribution).toFixed(2)}</td>
                <td>{(student.Practical_Contribution).toFixed(2)}</td>
                <td>{(student.Work_Ethic).toFixed(2)}</td>
                <td> {getTotalAverageScore(student)}</td>
                <td style={{textAlign: 'center'}}>{student.review_count}
                </td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding:'50px' }}>No reviews submitted by students.</td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default Peers_Summary;
