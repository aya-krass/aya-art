/* AYA WORLD — main app */
const { useEffect: useEffectMain } = React;

function App(){
  useEffectMain(()=>{
    document.documentElement.style.scrollBehavior = 'smooth';
  },[]);
  return (
    <>
      <Threshold/>
      <HeartCursor/>
      <Chrome/>
      <ActRail/>
      <main>
        <Overture/>
        <Manifesto/>
        <Court/>
        <DrawCard/>
        <AskAya/>
        <Pact/>
        <Reel/>
        <Blindfold/>
        <Signature/>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
