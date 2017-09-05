package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FormulaValidation
{

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(FormulaValidation.class);

	FormulaValidation()
	{
		propertiesMap= OdataUtility.getPropertiesMap();
	}

	/**
	 * validateFormula method used to validate the formula.
	 * 
	 * @param formula
	 *            Formula name
	 * @param colNames
	 *            Column names with comma separator
	 * @param connection
	 *            Database connection
	 * @return
	 *			  Return HTTPS response code.
	 */
	public int validateFormula(String formula, String colNames, Connection connection)
	{

		int status= HttpServletResponse.SC_OK;
		String columnData= null;
		String[] columnNames= null;
		Statement stmt= null;

		try
		{
			if(colNames != null)
			{
				columnNames= colNames.split(",");
			}

			for(int i= 0; i < columnNames.length; ++i)
			{
				String colTypeName= getColumnDataType(columnNames[i], connection);
				if(columnData == null)
				{
					columnData= columnNames[i] + " " + colTypeName + ",";
				}
				else
				{
					columnData+= columnNames[i] + " " + colTypeName + ",";
				}
			}
			columnData= columnData.substring(0, columnData.length() - 1);

			String storeProcedure= "call VALIDATE_EXPRESSION('CS','" + formula + "', '" + columnData + "')";

			stmt= connection.createStatement();
			stmt.execute(storeProcedure);
			OdataUtility.responseMessage="SUCCESS";
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage="FAILED";
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage="FAILED";
		}
		finally
		{
			OdataUtility.safeClose(stmt);
		}
		return status;
	}

	/**
	 * getColumnDataType method used to get Datatype of a given column from Database.
	 * 
	 * @param colNames
	 *            Column name
	 * @param connection
	 *            Database connection
	 * @return
	 *			  Return datatype of column.
	 */
	public String getColumnDataType(String colName, Connection connection) throws SQLIntegrityConstraintViolationException, SQLException
	{
		String dataBase= propertiesMap.get("dataBase");
		String tableName= "COMMONFACTS";
		String typeName= null;
		ResultSet res= null;
		try
		{
			res= connection.getMetaData().getColumns(dataBase, dataBase, tableName, "%");

			while(res.next())
			{
				String name= res.getString("COLUMN_NAME");
				if(name.equalsIgnoreCase(colName))
				{
					typeName= res.getString("TYPE_NAME");
				}
			}
		}
		finally
		{
			OdataUtility.safeClose(res);
		}
		return typeName;
	}
}
