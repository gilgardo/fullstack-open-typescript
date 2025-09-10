import type { CoursePart } from "../types";

const ContentView = ({ part }: { part: CoursePart }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (part.kind) {
    case "basic":
      return (
        <>
          <p>
            {part.name} Exercise: {part.exerciseCount}
          </p>
          <em>Description: {part.description}</em>
          <hr />
        </>
      );
    case "background":
      return (
        <>
          <p>
            {part.name} Exercise: {part.exerciseCount}
          </p>
          <em>Description: {part.description}</em>
          <div>material: {part.backgroundMaterial}</div>
          <hr />
        </>
      );
    case "group":
      return (
        <>
          <p>
            {part.name} Exercise: {part.exerciseCount}
          </p>
          <em>Group Projects : {part.groupProjectCount}</em>
          <hr />
        </>
      );
    default:
      assertNever(part);
  }
};

const Content = ({ content }: { content: CoursePart[] }) => {
  return (
    <>
      {content.map((part) => (
        <ContentView part={part} />
      ))}
    </>
  );
};

export default Content;
