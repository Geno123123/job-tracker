package com.geno.job_tracker.dto;

public record ProfileRequest(
        String phone,
        String school,
        String major,
        String studentId,
        String introduction,
        String desiredPosition){

}
