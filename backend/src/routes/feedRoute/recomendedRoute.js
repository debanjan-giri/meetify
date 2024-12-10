// d: "/user-list-suggestions", // get list of user suggestions
// shuffle

export const suffledUserList = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Check if user is authenticated
    if (!userId) {
      return errResponse(next, "User not authenticated", 401);
    }

    // Get random user list

    // Combine all results into one array

    return okResponse(res, "Employee list fetched successfully");
  } catch (error) {
    console.error(`Error in getEmployeeListController : ${error.message}`);
    next(error);
  }
};
