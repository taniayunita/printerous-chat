import { atom } from "recoil";

export const selectedUserState = atom({
  key: "selectedUser",
  default: { id: null, name: "Pilih contact untuk memulai percakapan" },
});
