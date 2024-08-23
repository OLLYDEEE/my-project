import React, { useEffect, useState } from "react";
import { supabase } from "./lib/helper/supabaseClient";

export default function App() {
  const [user, setUser] = useState(null);

  const login = async function signInWithGithub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) {
        console.error("Error during GitHub login:", error.message);
      } else {
        console.log("GitHub login data:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const logout = async function signOutWithGithub() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error.message);
      } else {
        console.log("Successfully signed out.");
        // Optionally, you can clear user state here
        setUser(null);
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setUser(data.session?.user);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

   
    

    // Ensure correct unsubscription
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      {user ? (
        <div className="">
          <h1>Congratulations, {user?.email}!</h1>

          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with GitHub</button>
      )}
    </div>
  );
}
