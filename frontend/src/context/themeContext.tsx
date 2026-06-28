import { createContext,useContext,useEffect,useState }  from "react";

type  ThemeContextType ={
    darkMode : boolean,
    toggleTheme : () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({
    children,
} : {
    children : React.ReactNode,
})=>{
    const [darkMode,setDarkMode] = useState(()=>{
        return localStorage.getItem("theme") === "dark"
    })


const toggleTheme = ()=>{
    setDarkMode ((prev) => !prev)
}

useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
},[darkMode])

return(
    <ThemeContext.Provider value={{darkMode,toggleTheme}}>
        {children}
    </ThemeContext.Provider>
)
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    )
  }

  return context
}