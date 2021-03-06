import { TransitionGroup } from "react-transition-group";

import { Box, Grid, Collapse } from "@mui/material";

import SectionHeading from "components/SectionHeading";
import TableCard from "./TableCard";
import SlideTransition from "components/Modal/SlideTransition";

import { Table } from "contexts/ProjectContext";

export interface ITableGridProps {
  sections: Record<string, Table[]>;
  getLink: (table: Table) => string;
  getActions?: (table: Table) => React.ReactNode;
}

export default function TableGrid({
  sections,
  getLink,
  getActions,
}: ITableGridProps) {
  return (
    <TransitionGroup>
      {Object.entries(sections).map(
        ([sectionName, sectionTables], sectionIndex) => {
          const tableItems = sectionTables
            .map((table, tableIndex) => {
              if (!table) return null;

              return (
                <SlideTransition
                  key={table.id}
                  appear
                  timeout={(sectionIndex + 1) * 100 + tableIndex * 50}
                >
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TableCard
                      {...table}
                      link={getLink(table)}
                      actions={getActions ? getActions(table) : null}
                    />
                  </Grid>
                </SlideTransition>
              );
            })
            .filter((item) => item !== null);

          if (tableItems.length === 0) return null;

          return (
            <Collapse key={sectionName}>
              <Box component="section" sx={{ mt: 4 }}>
                <SlideTransition
                  key={"grid-section-" + sectionName}
                  in
                  timeout={(sectionIndex + 1) * 100}
                >
                  <SectionHeading sx={{ pl: 2, pr: 1.5 }}>
                    {sectionName}
                  </SectionHeading>
                </SlideTransition>

                <Grid component={TransitionGroup} container spacing={2}>
                  {tableItems}
                </Grid>
              </Box>
            </Collapse>
          );
        }
      )}
    </TransitionGroup>
  );
}
