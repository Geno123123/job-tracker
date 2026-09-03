export const STAGES = [
    { key: "DOCUMENT", label: "서류", color: "bg-stage-document" },
    { key: "CODING_TEST", label: "코딩테스트", color: "bg-stage-codingtest" },
    { key: "INTERVIEW", label: "면접", color: "bg-stage-interview" },
    { key: "PASSED", label: "합격", color: "bg-stage-passed" },
    { key: "FAILED", label: "불합격", color: "bg-stage-failed" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

export type Application = {
    id: number;
    companyName: string;
    position: string;
    status: StageKey;
    deadline: string | null;
};

export type LoginResponse = {
    accessToken: string;
    email: string;
    name: string;
};