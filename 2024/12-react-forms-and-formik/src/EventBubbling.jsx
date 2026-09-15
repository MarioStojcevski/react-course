function EventBubbling() {
  const dontBubbleClickHandler = (event) => {
    alert('Child clicked');
    event.stopPropagation();
  }

  const bubbleClickHandler = (event) => {
    alert('Parent clicked');
    console.log(event.target);
  }

  return (
    <div onClick={() => { alert('clicked on top')}}>
     <h2>Bubbling Event in Javascript</h2>
      <div id="parent" onClick={() => {
        alert('Div clicked');
      }}>
          <button onClick={bubbleClickHandler}>
              <h2>This bubbles</h2>
          </button>
          <button id="child" onClick={dontBubbleClickHandler}>
              <p>This doesnt bubble</p>
          </button>
      </div>
    </div>
  )
};

export default EventBubbling;
