import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Medicine = {
    id : Nat;
    name : Text;
    dosage : Text;
    scheduleTimes : [Int];
    description : Text;
    photo : ?Storage.ExternalBlob;
  };

  type MedicalProfile = {
    name : Text;
    age : Nat;
    emergencyContact : Text;
    chronicConditions : [Text];
    allergies : [Text];
    medicines : [Medicine];
    photo : ?Storage.ExternalBlob;
  };

  type SymptomSession = {
    symptoms : [Text];
    timestamp : Int;
    adviceGiven : Text;
  };

  module Medicine {
    public func compare(med1 : Medicine, med2 : Medicine) : Order.Order {
      switch (Text.compare(med1.name, med2.name)) {
        case (#equal) { Nat.compare(med1.id, med2.id) };
        case (order) { order };
      };
    };
  };

  let profiles = Map.empty<Principal, MedicalProfile>();
  let symptomSessions = Map.empty<Principal, List.List<SymptomSession>>();
  var nextMedicineId = 0;

  // Required by instructions: get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?MedicalProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  // Required by instructions: save the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : MedicalProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Required by instructions: get a specific user's profile (own or admin)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?MedicalProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func recordSymptomSession(symptoms : [Text], advice : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };

    let session : SymptomSession = {
      symptoms;
      timestamp = Time.now();
      adviceGiven = advice;
    };

    let currentSessions = switch (symptomSessions.get(caller)) {
      case (null) { List.empty<SymptomSession>() };
      case (?sessions) { sessions };
    };

    currentSessions.add(session);
    symptomSessions.add(caller, currentSessions);
  };

  // Only the owner or an admin can view medications
  public query ({ caller }) func getUserMedications(user : Principal) : async [Medicine] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own medications");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        profile.medicines.sort();
      };
    };
  };

  // Only the owner or an admin can view the profile photo
  public query ({ caller }) func getProfilePhoto(user : Principal) : async ?Storage.ExternalBlob {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile photo");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.photo };
    };
  };
};
