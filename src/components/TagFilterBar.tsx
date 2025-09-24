import React from 'react';
import { getTagColors } from '../utils/tagColors.js';
import { TODAY_FILTER, TOMORROW_FILTER, PAST_DUE_FILTER } from '../utils/schedule.js';

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
  return (
    <div className="App__Tag-Filter-Container">
      {[
        { label: 'Past due', value: PAST_DUE_FILTER },
        { label: 'Today', value: TODAY_FILTER },
        { label: 'Tomorrow', value: TOMORROW_FILTER },
      ].map(filter => {
        const isActive = selectedTag === filter.value;
        return (
          <span
            key={filter.value}
            onClick={() => {
              const newTag = isActive ? null : filter.value;
              setSelectedTag(newTag);
              setSelectedIndex(0);
            }}
            className={`App__Tag-Filter App__Tag-Filter--builtin ${isActive ? 'App__Tag-Filter--active' : ''}`}
          >
            {filter.label}
          </span>
        );
      })}
      {allTags.map(tag => (
        <span
          key={tag}
          onClick={() => {
            const newTag = tag === selectedTag ? null : tag;
            setSelectedTag(newTag);
            setSelectedIndex(0);
          }}
          className={`App__Tag-Filter ${selectedTag === tag ? 'App__Tag-Filter--active' : ''}`}
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
