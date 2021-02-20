import { useState } from 'react';

export const Editable = ({ text, type, placeholder, children, ...props }) => {
  const [isEditing, setEditing] = useState(false);
  const handleKeyDown = (/* event, type */) => {};
  const editing = () => (
    <div
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => handleKeyDown(e, type)}
    >
      {children}
    </div>
  );

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  const displaying = () => (
    <div onClick={() => setEditing(true)}>
      <span>
        {text || placeholder || 'Editable content'}
      </span>
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events */

  return (
    <section {...props}>
      {isEditing ? editing() : displaying()}
    </section>
  );
};
