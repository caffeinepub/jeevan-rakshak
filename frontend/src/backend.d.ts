import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Medicine {
    id: bigint;
    scheduleTimes: Array<bigint>;
    dosage: string;
    name: string;
    description: string;
    photo?: ExternalBlob;
}
export interface MedicalProfile {
    age: bigint;
    name: string;
    emergencyContact: string;
    chronicConditions: Array<string>;
    photo?: ExternalBlob;
    medicines: Array<Medicine>;
    allergies: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<MedicalProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfilePhoto(user: Principal): Promise<ExternalBlob | null>;
    getUserMedications(user: Principal): Promise<Array<Medicine>>;
    getUserProfile(user: Principal): Promise<MedicalProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordSymptomSession(symptoms: Array<string>, advice: string): Promise<void>;
    saveCallerUserProfile(profile: MedicalProfile): Promise<void>;
}
