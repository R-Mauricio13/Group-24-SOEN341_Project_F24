/**
 * @jest-environment jsdom
 */
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import PEERS_SUMMARY from "../Pages/Peers_Summary";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
describe("Peers_Summary", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  it("Renders in the Summary of Details table", async () => {
    //Mocks the peer_reviews call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            Cooperation: 2,
            Conceptional_Contribution: 2,
            Practical_Contribution: 2,
            Work_Ethic: 2,
            user_id: 8,
            coop_comment: "",
            cc_comment: "",
            we_comment: "",
            pc_comment: "",
            user_author: "b_fall",
            first_name: "Brittany",
            last_name: "Falls",
            user_role: "student",
            username: "B_FALL",
            user_password: "bf",
            group_id: 2,
            team_name: "Group 2",
            team_size: 5,
          },

          {
            Cooperation: 5,
            Conceptional_Contribution: 4,
            Practical_Contribution: 1,
            Work_Ethic: 5,
            user_id: 8,
            coop_comment: "",
            cc_comment: "",
            we_comment: "",
            pc_comment: "",
            user_author: "t_thom",
            first_name: "Brittany",
            last_name: "Falls",
            user_role: "student",
            username: "B_FALL",
            user_password: "bf",
            group_id: 2,
            team_name: "Group 2",
            team_size: 5,
          },
        ]),
    });
    //Mocks the review-counts call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { user_id: 8, review_count: 2 },
          { user_id: 1, review_count: 3 },
          { user_id: 2, review_count: 2 },
        ]),
    });

    render(<PEERS_SUMMARY />);

    await waitFor(() => {
      // Checking if Last name Falls is present
      expect(screen.getByText("Falls")).toBeInTheDocument();
    });

    await waitFor(() => {
      // Checking if the average is being computed
      expect(screen.getByText("2.88")).toBeInTheDocument();
    });
  });

  it("Sorts all user_id's from the summary table in ascending order", async () => {
    //Mocks the peer_reviews call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            Cooperation: 2,
            Conceptional_Contribution: 2,
            Practical_Contribution: 2,
            Work_Ethic: 2,
            user_id: 8,
            coop_comment: "",
            cc_comment: "",
            we_comment: "",
            pc_comment: "",
            user_author: "b_fall",
            first_name: "Brittany",
            last_name: "Falls",
            user_role: "student",
            username: "B_FALL",
            user_password: "bf",
            group_id: 2,
            team_name: "Group 2",
            team_size: 5,
          },
          {
            Cooperation: 3,
            Conceptional_Contribution: 1,
            Practical_Contribution: 3,
            Work_Ethic: 3,
            user_id: 1,
            coop_comment: "test",
            cc_comment: "",
            we_comment: "",
            pc_comment: "",
            user_author: "d_moor",
            first_name: "Marie",
            last_name: "Hills",
            user_role: "student",
            username: "M_Hills",
            user_password: "mh",
            group_id: 1,
            team_name: "Group 1",
            team_size: 5,
          },
          {
            Cooperation: 3,
            Conceptional_Contribution: 3,
            Practical_Contribution: 3,
            Work_Ethic: 3,
            user_id: 2,
            coop_comment: "",
            cc_comment: "",
            we_comment: "",
            pc_comment: "",
            user_author: "d_moor",
            first_name: "Jacob",
            last_name: "Stevens",
            user_role: "student",
            username: "J_STEV",
            user_password: "js",
            group_id: 1,
            team_name: "Group 1",
            team_size: 5,
          },
        ]),
    });
    //Mocks the review-counts call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { user_id: 8, review_count: 2 },
          { user_id: 1, review_count: 3 },
          { user_id: 2, review_count: 2 },
        ]),
    });

    render(<PEERS_SUMMARY />);

    fireEvent.click(screen.getByText("Student ID"));

    //Clicking the Student ID column

    await waitFor(() => {
      const ascendingRows = screen.getAllByRole("row");
      expect(ascendingRows[1].textContent).toContain("1"); // First student ID after sorting
    });

    await waitFor(() => {
      const ascendingRows = screen.getAllByRole("row");
      expect(ascendingRows[2].textContent).toContain("2"); // Second student ID after sorting
    });

    await waitFor(() => {
      const ascendingRows = screen.getAllByRole("row");
      expect(ascendingRows[3].textContent).toContain("8"); // Third student ID after sorting
    });

    
    fireEvent.click(screen.getByText("Student ID"));
    const descendingRows = screen.getAllByRole("row");

    await waitFor(() => {
      expect(descendingRows[1].textContent).toContain("8"); // First student ID after sorting
    });

    await waitFor(() => {
      expect(descendingRows[2].textContent).toContain("2"); // Second student ID after sorting
    });

    await waitFor(() => {
      expect(descendingRows[3].textContent).toContain("1"); // Third student ID after sorting
    });
  });
});
