# Genome Landing Page Improvements, June 2022

After a report of the Genome Landing Page failure during a time of major performance issues in KBase production, I set about to improve it with these goals:

- handle service errors more gracefully

- isolate errors in the interface

- decrease the number of service calls, if possible

- generally improve the consistency of the layout

## Handing Service Errors more Gracefully

As is typical in old UI code, errors are handled inconsistently. These generally fall in to the following categories:

- not handled, leading to unpredictable behavior, empty display areas, or a broken ui 

- handled, but nothing displayed

- cryptic, terse display - e.g. simply "Error!".

- cryptic, voluminous display - sometimes an upstream or local stack track is displayed, which is not usually useful to users (but may be useful to developers)

- inconsistent display

The solution is to add consistency to the handling of errors, using the following techniques:

- consistent display using a Bootstrap alert

- always show both a contextual message and the original message; a contextual message might be "The search failed", and the original message might be "Network error", resulting in a full message "The search failed: Network error". This provides enough context that a user can report the error, and perhaps understand the meaning, or at least the impact on their usage. 

- always print the exception to the browser console; this assists diagnosis, either by directing users to their browser console to obtain a screenshot, or in replication by KBase developers

- Always display errors; unless an error results in a code path to acceptable alternative behavior, it should always result in an alert displayed to the user.

- Always catch errors; any code which may fail must be wrapped in a try ... except control flow. Since we may now rely upon async/await, it is preferable to use async/await with try/except; older code which uses promise chaining should be refactored if possible, but if not the final  .catch(..) must print to console and display the error (and all promises must be returned or be thus handled.)

## Isolate Errors in the Interface

An interface can be decomposed into components (similar to widgets). The genome landing page, like many landing pages and other KBase interfaces, is comprised of multiple sections, each of which derives it's data from a different service, or at least different service calls. Each of these sections should can be implemented as a component. This structure allows each component to display an error message in it's place if an error is encountered with the service (or handling of the service response, etc.). This decomposition allows errors to be isolated, and the interface to be usable in the face of partial failure.

The Genome landing page was largely structured in this manner, but not entirely.

Another implication of this design is that components form a hierarchy, or tree, in which a higher component may be responsible for fetching and preparing data for subsequent ones.

This is the case in the landing page design in general. For instance, the top level component of any landing page fetches the object and workspace info for a given object, determines if the user may have access, and uses the type information to dispatch to the appropriate landing page. 

Within a given landing page a similar structure is implemented.

In the case of the genome landing page this structure was not followed, which created an awkward situation in which the first "overview" widget might encounter an error fetching the genome, but other "sister" widgets would not be prepared for this error. 

The solution is to move the genome handling code to a higher level, and only if that succeeds to display any sub-components.

## Decrease the Number of Service Calls

TODO

## Improve Consistency of Layout

TODO

## Summary of Changes

- Refactor fetching of genome from services: GenomeAnnotationAPI, AssemblyAPI
  - remove unnecessary duplicate call to GenomeAnnotationAPI for non-Eukaryote/plant

- Refactor most `jquery` widgets into `preact` components

- Refactor landing page section panels into tabs
  - tabs don't call services until they are opened; this reduces service load

- Genome Overview Tab

  - refactor `jquery` widgets into `preact` components

- Publication tab:
  
  - Fetch up to 100 publications, not just 50
  
  - Reimplement publications DataTable into internal table component
  
  - Add sort control (works with search), remove column sorting (does not work with search)

- Taxonomy tab
  
  - lineage display now shows RE taxonomy if available, Object taxonomy if not.
  
  - Added message indicating the source of the taxonomy, and the destination of the links.

- Assembly and Annotation Tab
  - all internal vis widgets are the original jquery (to much to improve now)
  - contig viewer
    - improved logic for not showing if contigs not available
  - seed and feature/gene table logic for not showing for Eukaryote and Plant

## Notes

- need to evaluate the LP against all genome object forms that exist; there are many optional fields, some of which are filled in from other sources (e.g. taxonomy from re, stats from assembly api)

- need to be able to simulate slow network connections

## Future Work

- Improve publications table to be infinitely scrolling; have existing work on this approach, just need to port into that table component.

- refactor gene table into the same infinitely scrolling table (paged tables introduce too much friction if not needed)

- spinner for services should show elapsed time and stages of "slowness" warning; otherwise, when services are slow the user has no idea what is happening (spinning beachball syndrome!)
