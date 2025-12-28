import "./button_archive.css";

function Button_archive() {
  const handleClick = async () => {
    if (!window.api?.runPython) {
      alert("Bridge not ready — check preload & main wiring.");
      return;
    }

    const result = await window.api.runPython("scripts/hello.py", ["Anuj"]);
    if (result.success) {
      console.log("Python output:", result.output);
      alert(result.output?.join("\n") || "No output");
    } else {
      console.error("Python error:", result.error);
      alert("Error: " + result.error);
    }
  };

  return (
    <button className="archive-btn" onClick={handleClick}>
      Archive
    </button>
  );
}

export default Button_archive;
