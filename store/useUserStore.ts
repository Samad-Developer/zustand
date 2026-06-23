import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type UserState = {
    user: {
        name: string,
        address: {
            city: string,
            country: string,
        }
    },

    updateCity: (city: string) => void,
}


// Updating store without immer
// export const useUserStore = create<UserState>()((set) => ({
//     // state
//     user: {
//         name: "Abdus samad",
//         address: {
//             city: "Swabi",
//             country: "Pakistan"
//         }
//     },

//     // actions
//     updateCity: (city: string) => set((state) => ({
//         user: {
//             ...state.user,
//             address: {
//                 ...state.user.address,
//                 city: city,
//             }
//         }
//     })) 
// }))

export const useUserStore = create<UserState>()(
    immer((set) => ({
        user: {
            name: "Samad Khan",
            address: {
                city: "Swabi",
                country: "Australia"
            }
        },

        updateCity: (city: string) => set((state) => {
            state.user.address.city = city
        })
    }))
)