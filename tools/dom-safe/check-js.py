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
    lines_to_fix_count = 0
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

    return [instances, 
        {
            'to_investigate': instances,
            'stats': {
                'safe_usages_annotated': {
                    'safe': safe_count
                }
            }
        }
    ]

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

    return [
        instances,
        {
            'to_investigate': instances,
            'stats': {
                'safe_usages_annotated': {
                    'safe': safe_count,
                    'ignored': ignore_count
                }
            }
        }
    ]


def check_jquery_function(jquery_methods, dir_to_check, show_files=True, omit_pattern=None, verbose=False):
    print('')
    print(f'Checking for potentially unsafe usage of jQuery method "{jquery_methods}"...')
    if omit_pattern is not None:
        print(f'Using omit pattern {omit_pattern}')

    files = glob.iglob('./**/*.js', root_dir=dir_to_check, recursive=True)
    instances = 0
    line_comment_count = 0
    safe_count = 0
    ignore_count = 0
    simple_string_count = 0
    simple_tag_count = 0
    dom_safe_text = 0
    dom_safe_value = 0
    dom_safe_error_message = 0
    error_alert_count = 0
    purified_text = 0
    total_lines_inspected = 0
    total_lines_detected = 0
    total_file_count = 0
    total_line_count = 0
    block_comment_count = 0
    block_comment_line_count = 0
    files_to_fix = {}
    for file in files:
        file_path = f'{dir_to_check}/{file}'
        if os.path.isdir(file_path):
            continue

        # omit files according to a pattern
        if omit_pattern is not None and re.search(omit_pattern, file): 
            continue

        total_file_count += 1

        block_comment = False

        with open(f'{dir_to_check}/{file}') as fin:
            lines = fin.readlines()

            total_line_count += len(lines)
            
            prev_line = None
            
            for line_number, raw_line in enumerate(lines):
                line = raw_line.rstrip()

                if block_comment:
                    if re.search('^[*]/\s*$', line):
                        block_comment = False
                        continue
                    else:
                        block_comment_line_count += 1

                if re.search('^(\s)*//', line):
                        line_comment_count += 1
                        prev_line = line
                        continue

                if re.search('^(\s)*[*]/', line):
                    block_comment = True
                    block_comment_count += 1
                    continue

                total_lines_inspected += 1

                handled = False
                for jquery_method in jquery_methods:
                    if f'{jquery_method}(' in line:
                        # Safe usage heuristic - skip lines which are comments (start with //)
                        # if re.search('^(\s)*//', line):
                        #     comment_count += 1
                        #     handled = True
                        # Annotation - check if safe (prev line contains an "xss safe" comment)
                        if prev_line is not None and re.search('^(\s)*//\s*xss\s*safe', prev_line):
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
                            occurences = len(re.compile(f'{jquery_method}[(]').findall(line))
                            if occurences == 1:
                                handled = True
                                # A simple, single-quoted string
                                if re.search(f"{jquery_method}[(]\s*['][^'<>]*[']\s*[)]", line):
                                    simple_string_count += 1
                                # Same but double-quoted string
                                elif re.search(f'{jquery_method}[(]\s*["][^"<>]*["]\s*[)]', line):
                                    simple_string_count += 1
                                # A quoted string with a simple tag, but not script.
                                elif re.search(f"{jquery_method}[(]['][<][a-z]+[\/]?[>]['][)]", line) and not re.search('script', line):
                                    simple_tag_count += 1
                                # A quoted string with a simple tag, but not script.
                                elif re.search(f'{jquery_method}[(]["][<][a-z]+[\/]?[>]["][)]', line) and not re.search('script', line):
                                    simple_tag_count += 1
                                # A simple jquery object which itself takes a simple tag which 
                                # doesn't contain "script"
                                # e.g. .html($('<div>')) or .append($('<span/>'))
                                elif re.search(f"{jquery_method}[(][$][(]['][<][a-z]+[\/]?[>]['][)]", line) and not re.search('script', line):
                                    simple_tag_count += 1
                                # Various usages of functions which ensure safe usage.
                                elif re.search(f"{jquery_method}[(]domSafeText[(].*[)][)]", line):
                                    dom_safe_text += 1
                                elif re.search(f"{jquery_method}[(]domSafeValue[(].*[)][)]", line):
                                    dom_safe_value += 1
                                elif re.search(f"{jquery_method}[(]domSafeErrorMessage[(].*[)][)]", line):
                                    dom_safe_error_message += 1
                                elif re.search(f"{jquery_method}[(][$]errorAlert[(].*[)][)]", line):
                                    error_alert_count += 1
                                elif re.search(f"{jquery_method}[(]DOMPurify[.]sanitize[(].*[)][)]", line):
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
        print('Totals')
        print('------')
        print(f'Total files: {total_file_count}')
        print(f'Total lines: {total_line_count}')
        print('Skipped')
        print('-------')
        print(f'Line comments: {line_comment_count}')
        print(f'Block comments: {block_comment_count}')
        print(f'Block comment lines: {block_comment_line_count}')
        print('')
        print('Safe usages detected')
        print('--------------------')
        print(f'Simple String: {simple_string_count}')
        print(f'Simple Tag: {simple_tag_count}')
        print(f'DOM Safe Text: {dom_safe_text}')
        print(f'DOM Safe Value: {dom_safe_value}')
        print(f'DOM Safe Error Message: {dom_safe_error_message}')
        print(f'Error Alert Widget: {error_alert_count}')
        print(f'Purified text: {purified_text}')
        print(f'Within comments: {line_comment_count}')
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

    return [instances, {
            'to_investigate': instances,
            'stats': {
                'total': {
                    'files': total_file_count,
                    'lines': total_line_count,
                    'lines_inspected': total_lines_inspected,
                    'lines_detected': total_lines_detected
                },
                'skipped': {
                    'line_comments': line_comment_count,
                    'block_comments': block_comment_count,
                    'block_comment_lines': block_comment_line_count
                },
                'safe_usages_detected': {
                    'simple_string': simple_string_count,
                    'simple_tag': simple_tag_count,
                    'dom_safe': dom_safe_text,
                    'dom_safe_error_message': dom_safe_error_message,
                    'dom_purify_sanitized': purified_text,
                    'error_alert': error_alert_count
                },
                'safe_usages_annotated': {
                    'safe': safe_count,
                    'ingored': ignore_count
                }
            }
        }
    ]


def update_stats(total_stats, stats):
    for key, value in stats.items():
        if key not in total_stats:
            total_stats[key] = value
        else:
            if isinstance(value, int):
                total_stats[key] += value
            else:
                update_stats(total_stats[key], value)

def print_stats(stats, indent=''):
    for key, value in stats.items():
        if isinstance(stats[key], int):
            print(f'{indent}{key}: {value:,}')
        else:
            print(f'{indent}{key}')
            print_stats(stats[key], indent = indent + '    ')

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
    total_stats = {}

    # This checks for raw usage of innerHTML.
    [error_count, stats] = check_inner_html(dir_to_check, show_files, omit_pattern=omit_pattern)
    total_errors += error_count
    update_stats(total_stats, stats)

    # This checks for preact usage.
    [error_count, stats] = check_preact_usage(dir_to_check, show_files, omit_pattern=omit_pattern)
    total_errors += error_count
    update_stats(total_stats, stats)

    # These appear to be all the jquery methods which can insert raw html strings into the DOM.
    # see https://api.jquery.com/category/manipulation/ 

    jquery_methods = [
        'append', 'html', 'prepend', 'appendTo', 'prependTo', 'after', 'before', 'insertAfter', 'insertBefore', 'replaceAll', 'replaceWith', 'wrap', 'wrapAll'
    ]
    [error_count, stats] = check_jquery_function(jquery_methods, dir_to_check, show_files=True, omit_pattern=omit_pattern, verbose=verbose)
    total_errors += error_count
    update_stats(total_stats, stats)

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

    print_stats(total_stats)

if __name__ == '__main__':  
    main()