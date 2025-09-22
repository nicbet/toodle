import React from 'react';
import { getTagColors } from '../utils/tagColors.js';

interface TagFilterBarProps {
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  setSelectedIndex: (index: number) => void;
  tagColorMap: Record<string, number>;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({
  allTags,
  selectedTag,
  setSelectedTag,
  setSelectedIndex,
  tagColorMap,
}) => {
  if (allTags.length === 0) return null;

  return (
    <div className="App__Tag-Filter-Container">
      {allTags.map(tag => (
        <span
          key={tag}
          onClick={() => {
            const newTag = tag === selectedTag ? null : tag;
            setSelectedTag(newTag);
            setSelectedIndex(0);
          }}
          className="App__Tag-Filter"
          style={{
            ...getTagColors(tag, tagColorMap),
            opacity: selectedTag && selectedTag !== tag ? 0.5 : 1
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagFilterBar;