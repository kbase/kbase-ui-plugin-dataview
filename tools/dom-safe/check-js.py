import sys
import glob
import re
import os

def check_inner_html(dir_to_check, show_files=False, omit_pattern=None, verbose=False):
    print('')
    print('Checking for innerHTML...')
    if omit_pattern is not None:
        print(f'Using omit pattern {omit_pattern}')

    files = glob.iglob('./**/*.js', root_dir=dir_to_check, recursive=True)
    instances = 0
    comment_count = 0
    safe_count = 0
    files_to_fix = {}
    for file in files:
        file_path = f'{dir_to_check}/{file}'
        if os.path.isdir(file_path):
            continue

        if omit_pattern is not None and re.search(omit_pattern, file): 
                continue

        with open(file_path) as fin:
            lines = fin.readlines()
            prev_line = None
            for line_number, line in enumerate(lines):
                handled = False
                if 'innerHTML' in line:

                    # skip lines which are comments (start with //)
                    if re.search('^(\s)*//', line):
                        comment_count += 1
                        handled = True
                     # check if safe (prev line contains a comment )
                    elif prev_line is not None and re.search('^(\s)*//\s*xss\s*safe', prev_line):
                        safe_count += 1
                        handled = True
                    else:
                        instances += 1

                    if not handled:
                        instances += 1
                        if file not in files_to_fix:
                            files_to_fix[file] = {
                                'count': 1,
                                'lines': [{
                                    'line_number': line_number,
                                    'line': line
                                }]
                            }
                        else:
                            files_to_fix[file]['count'] += 1
                            files_to_fix[file]['lines'].append({
                                'line_number': line_number,
                                'line': line
                            })
                prev_line = line

    if verbose or instances > 0:
        print(f'Found: {instances}')
        print(f'Comments: {comment_count}')
        print(f'Safe: {safe_count}')

        total = 0
        sorted_files = sorted(files_to_fix.items(), key=lambda item: item[1]['count'])
        for filename, record in sorted_files:
            total += record['count']
            print(f'{filename}: {record["count"]}')

        if show_files:
                if len(sorted_files) > 0:
                    filename, record = sorted_files[len(sorted_files) - 1]
                    print(f'File: {filename}')
                    print('----')
                    for line_stats in record['lines']:
                        print(f'[{line_stats["line_number"] + 1}] {line_stats["line"]}')

    return instances

def check_preact_usage(dir_to_check, show_files=True, omit_pattern=None, verbose=False):
    print('')
    print(f'Checking for potentially unsafe usage of preact ...')
    if omit_pattern is not None:
        print(f'Using omit pattern {omit_pattern}')

    files = glob.iglob('./**/*.js', root_dir=dir_to_check, recursive=True)
    instances = 0
    comment_count = 0
    safe_count = 0
    ignore_count = 0
    files_to_fix = {}
    for file in files:
        file_path = f'{dir_to_check}/{file}'
        if os.path.isdir(file_path):
            continue

        # omit files according to a pattern
        if omit_pattern is not None and re.search(omit_pattern, file): 
            continue

        with open(f'{dir_to_check}/{file}') as fin:
            lines = fin.readlines()
            
            prev_line = None
            
            for line_number, raw_line in enumerate(lines):
                line = raw_line.rstrip()
                handled = False
                if 'dangerouslySetInnerHTML' in line:
                    # skip lines which are comments (start with //)
                    # Safe usage heuristics
                    if re.search('^(\s)*//', line):
                        comment_count += 1
                        handled = True
                    # Annotations
                    # check if safe (prev line contains a "safe" comment)
                    elif prev_line is not None and re.search('^(\s)*//\s*xss\s*safe', prev_line):
                        safe_count += 1
                        handled = True
                    elif prev_line is not None and re.search('^(\s)*//\s*xss\s*ignore', prev_line):
                        ignore_count += 1
                        handled = True

                    if not handled:
                        instances += 1
                        if file not in files_to_fix:
                            files_to_fix[file] = {
                                'count': 1,
                                'lines': [{
                                    'line_number': line_number,
                                    'line': line
                                }]
                            }
                        else:
                            files_to_fix[file]['count'] += 1
                            files_to_fix[file]['lines'].append({
                                'line_number': line_number,
                                'line': line
                            })

                prev_line = line

    if verbose or instances > 0:
        print('')
        print('Safe usages detected')
        print('--------------------')
        print(f'Within comments: {comment_count}')
        print('')
        print('Safe usages annotated')
        print('---------------------')
        print(f'Safe: {safe_count}')
        print(f'Ingored: {ignore_count}')
        print('')
        if instances == 0:
            print('Nothing to investigate')
        else:
            print(f'{instances} instance{"" if instances == 1 else "s"} to investigate')
            print('')

            total = 0
            sorted_files = sorted(files_to_fix.items(), key=lambda item: item[1]['count'])
            for filename, record in sorted_files:
                total += record['count']
                print(f'{filename}: {record["count"]}')

            print('------')
            print(total)
            print('')

            if show_files:
                if len(sorted_files) > 0:
                    filename, record = sorted_files[len(sorted_files) - 1]
                    print(f'File: {filename}')
                    print('----')
                    for line_stats in record['lines']:
                        print(f'[{line_stats["line_number"] + 1}] {line_stats["line"]}')

    return instances    


def check_jquery_function(jquery_function, dir_to_check, show_files=True, omit_pattern=None, verbose=False):
    print('')
    print(f'Checking for potentially unsafe usage of jQuery method "{jquery_function}"...')
    if omit_pattern is not None:
        print(f'Using omit pattern {omit_pattern}')

    files = glob.iglob('./**/*.js', root_dir=dir_to_check, recursive=True)
    instances = 0
    comment_count = 0
    safe_count = 0
    ignore_count = 0
    simple_string_count = 0
    simple_tag_count = 0
    dom_safe_text = 0
    dom_safe_value = 0
    dom_safe_error_message = 0
    purified_text = 0
    files_to_fix = {}
    for file in files:
        file_path = f'{dir_to_check}/{file}'
        if os.path.isdir(file_path):
            continue

        # omit files according to a pattern
        if omit_pattern is not None and re.search(omit_pattern, file): 
            continue

        with open(f'{dir_to_check}/{file}') as fin:
            lines = fin.readlines()
            
            prev_line = None
            
            for line_number, raw_line in enumerate(lines):
                line = raw_line.rstrip()
                handled = False
                if f'{jquery_function}(' in line:
                    # Safe usage heuristic - skip lines which are comments (start with //)
                    if re.search('^(\s)*//', line):
                        comment_count += 1
                        handled = True
                    # Annotation - check if safe (prev line contains an "xss safe" comment)
                    elif prev_line is not None and re.search('^(\s)*//\s*xss\s*safe', prev_line):
                        safe_count += 1
                        handled = True
                    # Annotation - check if ignorable (prev line contains an "xss ignore" comment)
                    elif prev_line is not None and re.search('^(\s)*//\s*xss\s*ignore', prev_line):
                        ignore_count += 1
                        handled = True
                    # check if contains just a simple string
                    # TODO: ensure only one appears in line
                    else:
                        # Safe usage hueristics
                        # if there are multiple instances, don't try to 
                        # be clever.
                        occurences = len(re.compile(f'{jquery_function}[(]').findall(line))
                        if occurences == 1:
                            handled = True
                            # A simple, single-quoted string
                            if re.search(f"{jquery_function}[(]\s*['][^'<>]*[']\s*[)]", line):
                                simple_string_count += 1
                            # Same but double-quoted string
                            elif re.search(f'{jquery_function}[(]\s*["][^"<>]*["]\s*[)]', line):
                                simple_string_count += 1
                            # A quoted string with a simple tag, but not script.
                            elif re.search(f"{jquery_function}[(]['][<][a-z]+[\/]?[>]['][)]", line) and not re.search('script', line):
                                simple_tag_count += 1
                            # A quoted string with a simple tag, but not script.
                            elif re.search(f'{jquery_function}[(]["][<][a-z]+[\/]?[>]["][)]', line) and not re.search('script', line):
                                simple_tag_count += 1
                            # A simple jquery object which itself takes a simple tag which 
                            # doesn't contain "script"
                            # e.g. .html($('<div>')) or .append($('<span/>'))
                            elif re.search(f"{jquery_function}[(][$][(]['][<][a-z]+[\/]?[>]['][)]", line) and not re.search('script', line):
                                simple_tag_count += 1
                            # Various usages of functions which ensure safe usage.
                            elif re.search(f"{jquery_function}[(]domSafeText[(].*[)][)]", line):
                                dom_safe_text += 1
                            elif re.search(f"{jquery_function}[(]domSafeValue[(].*[)][)]", line):
                                dom_safe_value += 1
                            elif re.search(f"{jquery_function}[(]domSafeErrorMessage[(].*[)][)]", line):
                                dom_safe_error_message += 1
                            elif re.search(f"{jquery_function}[(]DOMPurify[.]sanitize[(].*[)][)]", line):
                                purified_text += 1
                            else:
                                handled = False

                    if not handled:
                        instances += 1
                        if file not in files_to_fix:
                            files_to_fix[file] = {
                                'count': 1,
                                'lines': [{
                                    'line_number': line_number,
                                    'line': line
                                }]
                            }
                        else:
                            files_to_fix[file]['count'] += 1
                            files_to_fix[file]['lines'].append({
                                'line_number': line_number,
                                'line': line
                            })

                prev_line = line

    if verbose or instances > 0:
        print('')
        print('Safe usages detected')
        print('--------------------')
        print(f'Simple String: {simple_string_count}')
        print(f'Simple Tag: {simple_tag_count}')
        print(f'DOM Safe Text: {dom_safe_text}')
        print(f'DOM Safe Value: {dom_safe_value}')
        print(f'DOM Safe Error Message: {dom_safe_error_message}')
        print(f'Purified text: {purified_text}')
        print(f'Within comments: {comment_count}')
        print('')
        print('Safe usages annotated')
        print('---------------------')
        print(f'Safe: {safe_count}')
        print(f'Ingored: {ignore_count}')
        print('')
        if instances == 0:
            print('Nothing to investigate')
        else:
            print(f'{instances} instance{"" if instances == 1 else "s"} to investigate')
            print('')

            total = 0
            sorted_files = sorted(files_to_fix.items(), key=lambda item: item[1]['count'])
            for filename, record in sorted_files:
                total += record['count']
                print(f'{filename}: {record["count"]}')

            print('------')
            print(total)
            print('')

            if show_files:
                if len(sorted_files) > 0:
                    filename, record = sorted_files[len(sorted_files) - 1]
                    print(f'File: {filename}')
                    print('----')
                    for line_stats in record['lines']:
                        print(f'[{line_stats["line_number"] + 1}] {line_stats["line"]}')

    return instances



def main():
    dir_to_check = sys.argv[1]
    print(f'Checking Javascript files (*.js) in {dir_to_check}')
    if len(sys.argv) == 3:
        omit_pattern = sys.argv[2]
        print(f'Omitting {omit_pattern}')
    else:
        omit_pattern = None
        print(f'without omitting anything')

    show_files = True
    verbose = False

    total_errors = 0

    # This checks for raw usage of innerHTML.
    total_errors += check_inner_html(dir_to_check, show_files, omit_pattern=omit_pattern)

    # This checks for preact usage.
    total_errors += check_preact_usage(dir_to_check, show_files, omit_pattern=omit_pattern)

    # These appear to be all the jquery methods which can insert raw html strings into the DOM.
    # see https://api.jquery.com/category/manipulation/ 
    total_errors += check_jquery_function('append', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('html', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('prepend', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('appendTo', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('prependTo', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('after', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('before', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('insertAfter', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('insertBefore', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('replaceAll', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('replaceWith', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('wrap', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('wrapAll', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += check_jquery_function('wrapInner', dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)

    print('')
    print('===================')
    print('')
    print('Finished with analysis')
    print('')
    if total_errors == 0:
        print('All Clear!!!')
    else:
        print('****************************')
        print(f'{total_errors} issue{"s" if total_errors != 1 else ""} above to resolve')
        print('****************************')

    print('')

if __name__ == '__main__':  
    main()