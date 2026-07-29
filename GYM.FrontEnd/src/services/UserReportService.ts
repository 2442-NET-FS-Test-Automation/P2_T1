import { api } from "../api/client";
import type { UserReportDTO } from "../types/UserReportDTO";


// URL: GET api/report/user/5/json
export const GetJsonReport = async (userId: number): Promise<UserReportDTO | null> => {
  try {
    const response = await api.get<UserReportDTO>(`/report/user/${userId}/json`);
    return response.data;
  } catch (error) {
    console.error("Error getting user reports:", error);
    return null;
  }
};


    // // URL: GET api/report/user/5/json
    // [HttpGet("user/{userId:int}/json")]
    // public async Task<ActionResult<UserReportDTO>> GetJsonReport(int userId)
    // {
    //     var report = await _service.GenerateUserReportAsync(userId);
        
    //     if (report is null)
    //         return NotFound($"No fitness metrics logs found to generate a report for User ID {userId}.");

    //     return Ok(report);
    // }