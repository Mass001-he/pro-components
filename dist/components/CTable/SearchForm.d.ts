import React from 'react';
import { SearchConfig } from './types';
interface SearchFormProps {
    searchConfig: SearchConfig[];
    onSearch?: (values: Record<string, any>) => void;
    onReset?: () => void;
    defaultCollapsed?: boolean;
}
declare const SearchForm: React.FC<SearchFormProps>;
export default SearchForm;
//# sourceMappingURL=SearchForm.d.ts.map