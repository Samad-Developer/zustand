
import RerenderComp1 from "@/component/RerenderComp1";
import RerenderComp2 from "@/component/RerenderComp2";

export default function App() {

  return (
    <main className="flex flex-col text-black w-full h-screen items-center justify-center">
 
      <h1 className="text-4xl mb-10">
        Testing Zustand Rerender with useShallow Hook
      </h1>

      {/* // WITHOUT useShallow — re-renders every time ANY product changes */}
      <RerenderComp1 />

      {/* // WITH useShallow — only re-renders when names actually change */}
      <RerenderComp2 />
    </main>
  );
}
